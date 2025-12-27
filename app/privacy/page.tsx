export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100 py-12 px-4">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-gray-700 text-base">
          <p>We value your privacy and are committed to protecting your personal information. This policy explains what data we collect, how we use it, and your rights regarding your information.</p>
          <h2 className="text-2xl font-bold text-indigo-700 mt-6 mb-2">Information We Collect</h2>
          <ul className="list-disc ml-6">
            <li>Account information (name, email, etc.)</li>
            <li>Usage data (pages visited, features used)</li>
            <li>Content you upload or create (notes, flashcards, etc.)</li>
          </ul>
          <h2 className="text-2xl font-bold text-indigo-700 mt-6 mb-2">How We Use Your Data</h2>
          <ul className="list-disc ml-6">
            <li>To provide and improve our services</li>
            <li>To personalize your experience</li>
            <li>To communicate important updates</li>
            <li>To ensure security and prevent abuse</li>
          </ul>
          <h2 className="text-2xl font-bold text-indigo-700 mt-6 mb-2">Your Rights</h2>
          <ul className="list-disc ml-6">
            <li>Access, update, or delete your data at any time</li>
            <li>Request a copy of your information</li>
            <li>Contact us with privacy concerns</li>
          </ul>
          <p>We never sell your data. For questions, contact us at <a href="mailto:privacy@brainwave.com" className="text-indigo-600 underline">privacy@brainwave.com</a>.</p>
        </div>
      </section>
    </main>
  );
}
