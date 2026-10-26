// Blood test centre Prototype Script

// ============================================================
// BOOKING EMAIL SETTINGS (Web3Forms - free, no backend needed)
// ------------------------------------------------------------
// 1. Go to https://web3forms.com, enter the admin email address
//    and click "Create Access Key". The key arrives by email.
// 2. Paste the key below (replace YOUR_ACCESS_KEY_HERE).
// 3. To notify more than one admin, create a key for each email
//    and add it to the list, e.g. ['key-for-admin1', 'key-for-admin2'].
// ============================================================
const WEB3FORMS_ACCESS_KEYS = ['YOUR_ACCESS_KEY_HERE'];
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

function generateBookingId() {
  return `#AAR-${Math.floor(10000 + Math.random() * 90000)}`;
}

// Sends booking details to every configured admin email.
// Resolves true if at least one email was delivered.
async function sendBookingEmail(subject, details) {
  const keys = WEB3FORMS_ACCESS_KEYS.filter(k => k && k !== 'YOUR_ACCESS_KEY_HERE');
  if (keys.length === 0) {
    console.error('Booking email not sent: add your Web3Forms access key in script.js (WEB3FORMS_ACCESS_KEYS).');
    return false;
  }

  const results = await Promise.allSettled(keys.map(async (key) => {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject,
        from_name: 'Blood Test Centre Website',
        ...details
      })
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Send failed');
    return true;
  }));

  results.forEach(r => { if (r.status === 'rejected') console.error('Booking email error:', r.reason); });
  return results.some(r => r.status === 'fulfilled');
}

function setButtonLoading(form, isLoading) {
  const btn = form.querySelector('button[type="submit"]');
  if (!btn) return;
  if (isLoading) {
    btn.dataset.originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.classList.add('opacity-70', 'cursor-wait');
    btn.innerHTML = '<span>Sending booking...</span>';
  } else {
    btn.disabled = false;
    btn.classList.remove('opacity-70', 'cursor-wait');
    if (btn.dataset.originalHtml) btn.innerHTML = btn.dataset.originalHtml;
    if (window.lucide) lucide.createIcons();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Set default date for booking forms to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toISOString().split('T')[0];

  const dateInput1 = document.getElementById('heroDate');
  const dateInput2 = document.getElementById('preferredDate');
  if (dateInput1) {
    dateInput1.value = formattedDate;
    dateInput1.min = formattedDate;
  }
  if (dateInput2) {
    dateInput2.value = formattedDate;
    dateInput2.min = formattedDate;
  }

  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOpenIcon = document.getElementById('menuOpenIcon');
  const menuCloseIcon = document.getElementById('menuCloseIcon');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        menuOpenIcon?.classList.add('hidden');
        menuCloseIcon?.classList.remove('hidden');
      } else {
        mobileMenu.classList.add('hidden');
        menuOpenIcon?.classList.remove('hidden');
        menuCloseIcon?.classList.add('hidden');
      }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuOpenIcon?.classList.remove('hidden');
        menuCloseIcon?.classList.add('hidden');
      });
    });
  }

  // --- Test Category Accordions ---
  const accordionBtns = document.querySelectorAll('.test-accordion-btn');
  accordionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentCard = btn.closest('.test-category-card');
      const content = parentCard.querySelector('.accordion-content');
      const arrow = btn.querySelector('.accordion-arrow');

      if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        arrow.classList.add('rotate-180');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        content.classList.add('collapsed');
        arrow.classList.remove('rotate-180');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // --- Filter Pills Handling ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const categoryCards = document.querySelectorAll('.test-category-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active style
      filterBtns.forEach(b => b.classList.remove('active-filter'));
      btn.classList.add('active-filter');

      const filterValue = btn.getAttribute('data-filter');

      categoryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const content = card.querySelector('.accordion-content');
        const arrow = card.querySelector('.accordion-arrow');

        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // expand the matching category
          content.classList.remove('collapsed');
          arrow.classList.add('rotate-180');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- Interactive Search across all 80 tests ---
  const searchInput = document.getElementById('testSearchInput');
  const testItems = document.querySelectorAll('.test-item');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.trim().toLowerCase();

      // If user typed in search, reset category filter pills to "all"
      if (term.length > 0) {
        filterBtns.forEach(b => {
          if (b.getAttribute('data-filter') === 'all') {
            b.classList.add('active-filter');
          } else {
            b.classList.remove('active-filter');
          }
        });
      }

      categoryCards.forEach(card => {
        let cardHasMatch = false;
        const itemsInCard = card.querySelectorAll('.test-item');
        const content = card.querySelector('.accordion-content');
        const arrow = card.querySelector('.accordion-arrow');

        itemsInCard.forEach(item => {
          const testNameElem = item.querySelector('.test-name');
          const testText = testNameElem ? testNameElem.textContent.toLowerCase() : item.textContent.toLowerCase();

          if (term === '' || testText.includes(term)) {
            item.classList.remove('hidden');
            cardHasMatch = true;

            // Highlight match
            if (term !== '' && testNameElem) {
              const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
              testNameElem.innerHTML = testNameElem.textContent.replace(regex, '<span class="highlight-match">$1</span>');
            } else if (testNameElem) {
              testNameElem.innerHTML = testNameElem.textContent; // remove highlight
            }
          } else {
            item.classList.add('hidden');
            if (testNameElem) {
              testNameElem.innerHTML = testNameElem.textContent;
            }
          }
        });

        if (cardHasMatch) {
          card.classList.remove('hidden');
          // auto expand if search query is active
          if (term.length > 0) {
            content.classList.remove('collapsed');
            arrow.classList.add('rotate-180');
          }
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }

  // --- Total Price Calculation on Main Booking Form ---
  const membersCountSelect = document.getElementById('membersCount');
  const totalPriceDisplay = document.getElementById('totalPriceDisplay');
  const basePricePerPerson = 999;

  if (membersCountSelect && totalPriceDisplay) {
    membersCountSelect.addEventListener('change', (e) => {
      const count = parseInt(e.target.value, 10) || 1;
      const total = count * basePricePerPerson;
      totalPriceDisplay.textContent = `₹${total.toLocaleString('en-IN')}/-`;
    });
  }

  // --- Modal & Toast Handling ---
  const bookingModal = document.getElementById('bookingModal');
  const modalCard = document.getElementById('modalCard');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalPatientName = document.getElementById('modalPatientName');
  const modalBookingId = document.getElementById('modalBookingId');
  const modalPhone = document.getElementById('modalPhone');
  const modalSlot = document.getElementById('modalSlot');
  const modalTotal = document.getElementById('modalTotal');

  function openSuccessModal(data) {
    if (!bookingModal) return;

    modalPatientName.textContent = data.name || 'Valued Patient';
    modalPhone.textContent = data.phone ? `+91 ${data.phone}` : '+91 7011074140';
    modalSlot.textContent = `${data.date || 'Tomorrow'} (${data.slot || 'Morning fasting'})`;
    modalTotal.textContent = data.total || '₹999/-';
    modalBookingId.textContent = data.bookingId || generateBookingId();

    bookingModal.classList.remove('pointer-events-none', 'opacity-0');
    bookingModal.classList.add('opacity-100');
    modalCard.classList.remove('scale-95');
    modalCard.classList.add('scale-100');

    if (window.lucide) lucide.createIcons();
  }

  function closeSuccessModal() {
    if (!bookingModal) return;
    bookingModal.classList.add('opacity-0', 'pointer-events-none');
    bookingModal.classList.remove('opacity-100');
    modalCard.classList.add('scale-95');
    modalCard.classList.remove('scale-100');
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeSuccessModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeSuccessModal();
      }
    });
  }

  function showToast(title, message) {
    const toast = document.getElementById('toastNotification');
    const toastTitle = document.getElementById('toastTitle');
    const toastMsg = document.getElementById('toastMsg');

    if (!toast) return;
    toastTitle.textContent = title;
    toastMsg.textContent = message;

    toast.classList.remove('translate-y-[-150%]', 'pointer-events-none');
    toast.classList.add('translate-y-0');

    setTimeout(() => {
      toast.classList.add('translate-y-[-150%]', 'pointer-events-none');
      toast.classList.remove('translate-y-0');
    }, 4500);
  }

  // --- Hero Quick Lead Form Submission ---
  const heroQuickForm = document.getElementById('heroQuickForm');
  if (heroQuickForm) {
    heroQuickForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('heroName').value.trim();
      const phone = document.getElementById('heroPhone').value.trim();
      const city = document.getElementById('heroCity')?.value.trim() || '';
      const pkgElem = document.getElementById('heroPackage');
      const pkg = pkgElem ? pkgElem.options[pkgElem.selectedIndex].text : '';
      const date = document.getElementById('heroDate').value;
      const slot = document.getElementById('heroSlot').value;
      const total = (pkg.match(/₹[\d,]+/) || ['₹999'])[0] + '/-';
      const bookingId = generateBookingId();

      setButtonLoading(heroQuickForm, true);
      const sent = await sendBookingEmail(`New Booking ${bookingId}: ${name} - ${date}`, {
        'Booking ID': bookingId,
        'Form': 'Quick Booking (Hero)',
        'Patient Name': name,
        'Phone': `+91 ${phone}`,
        'City / Pincode': city,
        'Package': pkg,
        'Preferred Date': date,
        'Time Slot': slot,
        'Amount': total
      });
      setButtonLoading(heroQuickForm, false);

      if (!sent) {
        showToast('Could not send booking', 'Please try again or call 7011074140 / 9899729650.');
        return;
      }

      openSuccessModal({ name, phone, date, slot, total, bookingId });
      showToast('Booking Received!', 'Our representative will call you shortly to confirm the appointment.');
      heroQuickForm.reset();
      const heroDate = document.getElementById('heroDate');
      if (heroDate) heroDate.value = formattedDate;
    });
  }

  // --- Main Booking Form Submission ---
  const mainBookingForm = document.getElementById('mainBookingForm');
  if (mainBookingForm) {
    mainBookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phoneNumber').value.trim();
      const age = document.getElementById('age')?.value || '';
      const genderElem = document.getElementById('gender');
      const gender = genderElem ? genderElem.options[genderElem.selectedIndex].text : '';
      const date = document.getElementById('preferredDate').value;
      const slotElem = document.getElementById('timeSlot');
      const slot = slotElem ? slotElem.options[slotElem.selectedIndex].text : 'Morning';
      const count = parseInt(document.getElementById('membersCount').value, 10) || 1;
      const address = document.getElementById('address')?.value.trim() || '';
      const totalAmount = `₹${(count * 999).toLocaleString('en-IN')}/-`;
      const bookingId = generateBookingId();

      setButtonLoading(mainBookingForm, true);
      const sent = await sendBookingEmail(`New Booking ${bookingId}: ${name} - Basic 2 for ${date}`, {
        'Booking ID': bookingId,
        'Form': 'Home Visit Booking',
        'Patient Name': name,
        'Phone': `+91 ${phone}`,
        'Age': age,
        'Gender': gender,
        'Package': 'Blood test centre Basic 2 With USTSH (80 Tests)',
        'No. of Persons': count,
        'Preferred Date': date,
        'Time Slot': slot,
        'Address': address,
        'Total Amount': totalAmount
      });
      setButtonLoading(mainBookingForm, false);

      if (!sent) {
        showToast('Could not send booking', 'Please try again or call 7011074140 / 9899729650.');
        return;
      }

      openSuccessModal({ name, phone, date, slot, total: totalAmount, bookingId });
      showToast('Appointment Scheduled!', 'Your home sample pickup is confirmed. Pay conveniently after sample collection.');
      mainBookingForm.reset();
      if (dateInput2) dateInput2.value = formattedDate;
      if (totalPriceDisplay) totalPriceDisplay.textContent = '₹999/-';
    });
  }

  // --- FAQ Accordions ---
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const parent = toggle.closest('.faq-item');
      const answer = parent.querySelector('.faq-answer');
      const icon = toggle.querySelector('[data-lucide="chevron-down"]');
      const isHidden = answer.classList.contains('hidden');

      // Close all other FAQs
      document.querySelectorAll('.faq-answer').forEach(ans => ans.classList.add('hidden'));
      document.querySelectorAll('.faq-toggle [data-lucide="chevron-down"]').forEach(ic => ic.classList.remove('rotate-180'));

      if (isHidden) {
        answer.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });

});
