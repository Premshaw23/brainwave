import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    question: 'What is BrainWave?',
    answer: 'BrainWave is an all-in-one learning platform offering notes, quizzes, flashcards, analytics, and a vibrant community to help you study smarter.'
  },
  {
    question: 'Is BrainWave free to use?',
    answer: 'Yes! BrainWave offers a free tier with core features. Some advanced features may require a subscription in the future.'
  },
  {
    question: 'How do I create flashcards or quizzes?',
    answer: 'Simply navigate to the Flashcards or Quizzes section from the dashboard and follow the prompts to create or generate new study materials.'
  },
  {
    question: 'Can I join study groups?',
    answer: 'Absolutely! You can join or create study groups to collaborate and learn with others.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we use industry-standard security practices to keep your data safe and private.'
  },
  {
    question: 'How do I contact support?',
    answer: 'You can reach out via the Community section or email us at support@brainwave.com.'
  }
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100 py-12 px-4">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Frequently Asked Questions</h1>
        <div className="space-y-6 mb-12">
          {faqs.map((faq, idx) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-indigo-700 mb-2">{faq.question}</h2>
                <p className="text-gray-700">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <p className="mb-4 text-gray-700">Still have questions?</p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg">
            <Link href="/community">Ask in the Community</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
