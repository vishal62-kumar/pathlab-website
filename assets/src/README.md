# Blood test centre - Preventive Health Checkup Frontend

This prototype static website frontend features **Blood test centre (BTC)** with preventive health checkup profiles based on the flyer.

---

## 📋 Branding & Elements

### 1. Brand Identity & Logo
- **Brand**: Blood test centre (BTC)
- **Logo**: `../assets/btc-logo.png`
- **Tagline**: *"Think Wellness. Think Prevention"*
- **Core Headline**: *"Experience our budget-friendly preventive health checkups with Blood test centre Basic Profiles"*

### 2. Featured Offer Package
- **Package Name**: `Blood test centre Basic 2 With USTSH (80 Tests)`
- **Special Offer Price**: **@ ₹999/-**
- **Promotional Notice**: `*Valid till a limited period`
- **Fasting Requirement**: `*10-12 hrs fasting is essential`

### 3. Full 80 Tests Breakdown across 8 Profiles
1. **Thyroid Profile (3 Tests)**:
   - Total Triiodothyronine (T3)
   - Total Thyroxine (T4)
   - TSH - Ultrasensitive (USTSH)
2. **Diabetes Profile (2 Tests)**:
   - Average Blood Glucose (ABG)
   - HbA1c
3. **Liver Profile (12 Tests)**:
   - Alkaline Phosphatase
   - Bilirubin - Direct, Total, Indirect
   - Gamma Glutamyl Transferase (GGT)
   - Protein - Total, Serum Albumin, Serum Globulin
   - SGOT [AST], SGPT [ALT]
   - Serum Albumin/Globulin Ratio, SGOT/SGPT Ratio
4. **Lipid Profile\* (10 Tests)** *(10-12 hrs fasting is essential)*:
   - Total Cholesterol, HDL, LDL, VLDL, Non-HDL Cholesterol
   - LDL/HDL Ratio, TC/HDL Ratio, Triglycerides, HDL/LDL Ratio, TRIG/HDL Ratio
5. **Kidney Profile (7 Tests)**:
   - BUN/Serum Creatinine Ratio, Blood Urea Nitrogen (BUN), Calcium
   - Serum Creatinine, Uric Acid, Urea (Calculated), Urea / SR. Creatinine Ratio
6. **CBC (Complete Blood Count) (28 Tests)**:
   - Hemoglobin, RBC Count, Platelets, TLC, Differential count (Neutrophils, Lymphocytes, Monocytes, Eosinophils, Basophils), Absolute counts, RDW, Mentzer Index, etc.
7. **Routine Urine Analysis (14 Tests)**:
   - Appearance, Colour, Leucocyte Esterase, Volume, Specific Gravity, Bilirubin, Blood, Urobilinogen, Glucose, Ketone, Pus cells, Nitrite, PH, Protein
8. **Iron Deficiency Profile (4 Tests)**:
   - % Transferrin Saturation, Iron, TIBC, UIBC

### 4. Official Contact Helpline Numbers
- **7011074140**
- **9899729650**
- WhatsApp direct booking integration

---

## 🚀 How to Open and View

Because this is a pure prototype static website frontend, you can run it immediately without needing to install Node.js or run any build steps:

1. **Directly in your browser**:
   - Double click [`index.html`](file:///c:/Users/hp/OneDrive/Desktop/aarogyam/index.html) in your file explorer to open it in Chrome, Edge, Safari, or Firefox.

2. **Using a local lightweight web server**:
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

---

## 🎨 Interactive Prototype Capabilities
- **Real-Time Test Search**: Filter and search through all 80 tests instantaneously with keyword highlighting.
- **Profile Filter Tabs**: Jump directly to Thyroid, Diabetes, Liver, Lipid, Kidney, CBC, Urine, or Iron profiles.
- **Interactive Accordions**: Clean collapse/expand view for all test parameters.
- **Fasting Preparation Guide**: Interactive instructions on 10-12 hour fasting rules.
- **Lead Capture & Booking Forms**: Form validation, dynamic price calculation per person, and a confirmation modal with booking ID.
- **Click-to-Call & WhatsApp**: Direct integration with the helpline numbers (`7011074140` & `9899729650`).
- **Fully Responsive**: Optimized for Mobile, Tablet, and Desktop screens.

---

## 📧 Booking Email Notifications (Web3Forms)

Both booking forms (the quick form at the top and the full home-visit form) email every booking to the admin with: Booking ID, name, phone, city/address, age, gender, package, number of persons, date, time slot and amount.

**One-time setup (2 minutes):**
1. Open https://web3forms.com, type the admin email (e.g. medcrosstech.health@gmail.com) and click **Create Access Key**.
2. Copy the key from the email you receive.
3. In `script.js`, replace `YOUR_ACCESS_KEY_HERE` with that key:
   ```js
   const WEB3FORMS_ACCESS_KEYS = ['paste-your-key-here'];
   ```
4. To notify several admins, create one key per email and list them all:
   ```js
   const WEB3FORMS_ACCESS_KEYS = ['key-admin-1', 'key-admin-2'];
   ```

The patient only sees the success popup once the email has actually gone out; if sending fails they get a message asking them to retry or call the helpline. The first email may land in Spam — mark it "Not spam" once.
