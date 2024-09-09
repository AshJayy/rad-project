import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { HiChevronRight } from "react-icons/hi";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const descriptionBoxes = [
    {
      title: "Extensive Question Banks",
      description: "Access to six diverse question banks with a total of 150 meticulously selected questions to challenge and enhance your knowledge.",
      image: '/img/home_d1.png'
    },
    {
      title: "Customized Exam Experience",
      description: "Create unique exams tailored to your needs with random selections from our question banks.",
      description2: "Each exam is a new opportunity to learn, with no repeated questions until you exhaust a bank.",
      image: '/img/home_d2.png'
    },
    {
      title: "Real-Time Tracking and Reports",
      description: "Keep track of your progress with a visible clock and instant feedback on your answers.",
      description2: "Detailed reports at the end of each exam highlight correct and incorrect answers.",
      image: '/img/home_d3.png'
    },
  ];

  const reviews = [
    {
      review: "ExamEase has been a game-changer for my exam prep. The extensive question banks and detailed reports have really helped me identify and improve my weak areas.",
      name: "Maria S",
      company: "University Student",
      bg: "#064a98cc"
    },
    {
      review: "I love how I can customize my exams and track my progress in real-time. The feedback is immediate and the explanations are very clear.",
      name: "John D.",
      company: "MBA Candidate",
      bg: "#067E98c4"
    },
    {
      review: "ExamEase's user-friendly interface makes it so easy to navigate and manage my study sessions. The unique exam generation feature ensures I'm always challenged.",
      name: "Liam T.",
      company: "Medical Student",
      bg: "#066C98cc"
    },
  ];

  const [visibleFAQ, setVisibleFAQ] = useState(null);
  const faq = [
    {
      q: "What subscription plans are available?",
      a: "There are monthly and annual subscription plans available.",
      link: "/subscribe",
    },
    {
      q: "Can I try ExamEase before purchasing a subscription?",
      a: "Yes you can try out the free trial",
      link: "/freetrial",
    },
    {
      q: "Can I track my progress over time?",
      a: "Yes. Your results are saved and analyzed, so that you can seamlessly track your progress over time.",
      link: "",
    },
    {
      q: "How secure is my data on ExamEase?",
      a: "Your data on ExamEase is very secure. We use advanced encryption and strict privacy measures to ensure your information is protected.",
      link: "",
    },
  ];

  const DescriptionCard = ({ index, content }) => (
    <div className="flex flex-col md:flex-row items-center gap-8 p-4 md:px-16 py-6 md:py-8 max-w-4xl rounded-3xl drop-shadow-lg bg-white">
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <img src={content.image} alt={content.title} className="w-full max-w-xs md:max-w-md" />
      </div>
      <div className={`${index % 2 === 0 ? "md:order-2" : ""} flex flex-col gap-3 max-w-xs md:max-w-lg`}>
        <h1 className="text-xl md:text-2xl font-semibold pb-2">{content.title}</h1>
        <p className="text-sm md:text-base">{content.description}</p>
        {content.description2 &&
          <p className="text-sm md:text-base">{content.description2}</p>
        }
      </div>
    </div>
  );

  const FAQ = ({ index, question }) => (
    <div key={index} className={`w-full max-w-lg bg-white drop-shadow-xl ${visibleFAQ === index ? "rounded-3xl" : "rounded-full"}`}>
      <button
        className="w-full px-4 py-3 text-sm font-bold text-left"
        onClick={() => setVisibleFAQ(visibleFAQ === index ? null : index)}
      >
        + {question.q}
      </button>
      {visibleFAQ === index &&
        <div className="px-4 pb-3 text-sm">
          <p>
            {question.a}
            {question.link &&
              <Link to={question.link} className="text-mid-blue px-2 opacity-100 hover:opacity-50">
                Learn more
                <HiChevronRight className="inline-block" />
              </Link>
            }
          </p>
        </div>
      }
    </div>
  );

  return (
    <main className="flex flex-col">

      <section id="hero" className="mx-auto px-4 py-8 md:px-8 md:py-16">
        <div className="my-8 md:my-16 flex flex-col gap-6 md:gap-8 items-center">
          <h1 className="text-4xl md:text-7xl font-extrabold text-dark-blue text-center">
            YOUR
            <span className="text-mid-blue"> ULTIMATE </span>
            <br />EXAM PREPARATION EXPERIENCE
          </h1>
          <p className="font-semibold text-dark-blue text-center text-base md:text-lg">
            A secure, easy-to-use platform designed for students to excel in exams with confidence.
          </p>
          <Button className="bg-mid-blue mx-auto" pill>
            {currentUser ? (
              <Link to={'/freetrial'}>Start free trial</Link>
            ) : (
              <Link to={'/signin'} state={{ from: '/freetrial' }}>Start free trial</Link>
            )}
          </Button>
        </div>
      </section>

      <section id="description" className="w-full bg-light-blue mt-8 md:mt-16">
        <div className="flex flex-col gap-6 p-6 md:p-10 items-center">
          <h1 className="text-xl md:text-2xl font-semibold mb-4">Master your exams with ease</h1>
          {descriptionBoxes.map((item, index) => (
            <DescriptionCard
              key={index}
              index={index}
              content={item}
            />
          ))}
        </div>
      </section>

      <section id="reviews" className="p-6 md:p-12 flex flex-col gap-8 items-center md:flex-row md:flex-wrap md:justify-between">
        {reviews.map((review, index) => (
          <div key={index} className={`w-full max-w-sm md:max-w-md h-auto flex flex-col gap-4 items-center justify-center p-6 text-sm rounded-xl drop-shadow-lg text-white text-center`} style={{ backgroundColor: review.bg }}>
            <p className="shadow-none">"{review.review}"</p>
            <p className="text-light-blue shadow-none">{review.name}, {review.company}</p>
          </div>
        ))}
      </section>

      <section className="w-full flex flex-col items-center gap-8 bg-light-blue p-8 md:p-16">
        <h1 className="text-xl md:text-2xl font-semibold">Frequently Asked Questions (FAQs)</h1>
        <div className="flex flex-col gap-4 w-full max-w-lg">
          {faq.map((question, index) => (
            <FAQ question={question} index={index} key={index} />
          ))}
        </div>
      </section>

      <section className="bg-mid-blue p-8 md:p-16 flex flex-col items-center gap-6">
        <h1 className="text-3xl md:text-5xl text-white font-bold text-center">Join ExamEase to ace your exams.</h1>
        <p className="text-white font-semibold text-center">Sign up now and explore our comprehensive exam preparation platform.</p>
        <Button className="bg-white mx-auto text-dark-blue font-semibold my-3" pill>
          {currentUser ? (
            <Link to={'/freetrial'}>Start free trial</Link>
          ) : (
            <Link to={'/signin'} state={{ from: '/freetrial' }}>Start free trial</Link>
          )}
        </Button>
      </section>

    </main>
  );
}
