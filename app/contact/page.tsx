import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100 py-12 px-4">
      <section className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Contact Us</h1>
        <div className="space-y-6 text-gray-700 text-base mb-8">
          <p>Have questions, feedback, or need support? We're here to help!</p>
          <ul className="list-disc ml-6">
            <li>Email: <a href="mailto:shawprem217gmail.com" className="text-indigo-600 underline">support@brainwave.com</a></li>
            <li>Community: <Link href="/community" className="text-indigo-600 underline">Join our Community</Link></li>
          </ul>
        </div>
        <div className="text-center">
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg">
            <a href="mailto:shawprem217gmail.com">Email Support</a>
          </Button>
        </div>
      </section>
    </main>
  );
}
