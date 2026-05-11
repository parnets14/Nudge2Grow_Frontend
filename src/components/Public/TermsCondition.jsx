import React from 'react';
import logo from '../../assets/logo.jpeg';

const TermsCondition = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <img src={logo} alt="Nudge2Grow Logo" className="h-10 w-auto object-contain" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms &amp; Conditions</h1>
          <p className="text-sm text-gray-400">Last updated: February 26, 2026</p>
          <div className="mt-4 h-1 w-16 bg-[#45a578] rounded-full" />
        </div>

        {/* Intro */}
        <p className="text-gray-600 text-base leading-relaxed mb-10">
          Please read these Terms and Conditions carefully before using Nudge2Grow. By accessing
          or using our platform, you confirm that you have read, understood, and agree to be bound
          by these terms. If you do not agree, please discontinue use of the service.
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>By creating an account or using any part of the Nudge2Grow platform, you agree to these Terms and Conditions in full.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>These terms apply to all users including parents, guardians, and any individual accessing the platform on behalf of a child.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>If you are registering on behalf of a minor, you confirm that you have the legal authority to do so and accept these terms on their behalf.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Use of Service</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>You agree to use Nudge2Grow solely for lawful, personal, and non-commercial educational purposes.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>You must not share your account with others or allow unauthorised access to the platform through your credentials.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>You agree not to attempt to reverse-engineer, decompile, or extract the source code of the application.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Any misuse, abuse, or exploitation of the platform will result in immediate account suspension.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Subscription and Payment</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Certain features of Nudge2Grow require a paid subscription. Subscription plans and pricing are displayed clearly within the app.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>All payments are processed securely through our authorised payment gateway. We do not store your card details.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Subscriptions automatically renew at the end of each billing cycle unless cancelled before the renewal date.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Refunds are considered on a case-by-case basis. Please contact support within 7 days of a charge if you believe an error has occurred.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>We reserve the right to change subscription pricing with reasonable prior notice to existing subscribers.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Content Ownership & Intellectual Property</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>All content on Nudge2Grow — including text, graphics, illustrations, flashcards, quizzes, and educational materials — is the exclusive property of Nudge2Grow.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Content is protected by applicable copyright, trademark, and intellectual property laws.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>You may not copy, reproduce, distribute, or create derivative works from any content without our prior written permission.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>The Nudge2Grow name, logo, and brand identity are registered trademarks and may not be used without authorisation.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">5. User Conduct</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>You agree not to upload, post, or transmit any content that is harmful, offensive, defamatory, or violates any applicable law.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>You must not interfere with or disrupt the integrity or performance of the platform or its servers.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Attempting to gain unauthorised access to any part of the platform, other user accounts, or backend systems is strictly prohibited.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>You must not use automated tools, bots, or scripts to scrape, crawl, or extract data from the platform.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">6. Account Termination</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>We reserve the right to suspend or permanently terminate your account if you violate any of these Terms without prior notice.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Accounts found to be involved in fraudulent activity, abuse, or misrepresentation will be terminated immediately.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>You may delete your account at any time through the app settings. Upon deletion, your data will be removed in accordance with our Privacy Policy.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Termination does not entitle you to a refund of any unused subscription period unless required by applicable law.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Nudge2Grow is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>We do not guarantee that the platform will be uninterrupted, error-free, or free from viruses or other harmful components.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>To the fullest extent permitted by law, Nudge2Grow shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Our total liability to you for any claim arising from these Terms shall not exceed the amount you paid us in the 3 months preceding the claim.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 8 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>We may revise these Terms at any time. The updated version will be posted on this page with a revised "Last updated" date.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>For significant changes, we will notify you via email or an in-app alert at least 7 days before the changes take effect.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Continued use of the platform after the effective date of any changes constitutes your acceptance of the revised Terms.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 9 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">9. Governing Law</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>These Terms shall be governed by and construed in accordance with the laws of India.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts located in India.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 10 — Contact */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>If you have any questions or concerns about these Terms and Conditions, please contact us.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Email: <a href="mailto:support@nudge2grow.com" className="text-[#45a578] underline">support@nudge2grow.com</a></span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>We aim to respond to all enquiries within 5 business days.</span>
            </li>
          </ul>
        </section>

        {/* Footer */}
        <div className="border-t border-gray-100 pt-6 text-center">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Nudge2Grow. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
};

export default TermsCondition;
