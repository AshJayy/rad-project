import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { HiChevronRight } from "react-icons/hi";
import { useState } from "react";

export default function Home() {
  const descriptionBoxes = [
    {
      title: "Extensive Question Banks",
      description: "Access to six diverse question banks with a total of 150 meticulously selected questions to challenge and enhance your knowledge.",
      image: '../../public/img/home_d1.png'
    },
    {
      title: "Customized Exam Experience",
      description: "Create unique exams tailored to your needs with random selections from our question banks.",
      description2: "Each exam is a new opportunity to learn, with no repeated questions until you exhaust a bank.",
      image: '../../public/img/home_d2.png'
    },
    {
      title: "Real-Time Tracking and Reports",
      description: "Keep track of your progress with a visible clock and instant feedback on your answers.",
      description2: "Detailed reports at the end of each exam highlight correct and incorrect answers..",
      image: '../../public/img/home_d3.png'
    },
  ];

  const reviews = [
    {
      review: '\"ExamEase has been a game-changer for my exam prep. The extensive question banks and detailed reports have really helped me identify and improve my weak areas.\"',
      name: "Maria S",
      company: "University Student",
      bg: "#064a98cc"
    },
    {
      review: '\"I love how I can customize my exams and track my progress in real-time. The feedback is immediate and the explanations are very clear.\"',
      name: "John D.",
      company: "MBA Candidate",
      bg: "#067E98c4"
    },
    {
      review: '\"ExamEase’s user-friendly interface makes it so easy to navigate and manage my study sessions. The unique exam generation feature ensures I\’m always challenged.\"',
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
      a: "Yes. Your results are saved an analyzed, so that you can seamlessly track your progress over time.",
      link: "",
    },
    {
      q: "How secure is my data on ExamEase?",
      a: "Your data on ExamEase is very secure. We use advanced encryption and strict privacy measures to ensure your information is protected.",
      link: "",
    },
  ]

  const DescriptionCard = ({index, content}) => {
    return(
      <div className="flex items-center gap-16 px-16 py-4 max-w-4xl rounded-3xl drop-shadow-lg bg-white">
        <div className="order-1 h-64 flex items-center">
          <img src={content.image} className="w-96" />
        </div>
        <div className={`${index % 2 == 1 ? "" : "order-2"} flex flex-col gap-3 max-w-96`}>
          <h1 className="font-semibold pb-2">{content.title}</h1>
          <p className="text-sm max-w-lg">{content.description}</p>
          {content.description2 &&
            <p className="text-sm max-w-lg">{content.description2}</p>
          }
        </div>
      </div>
    )
  }

  return (
    <main className="flex flex-col">

      <section id="hero" className="mx-auto ">
        <div className="my-28 flex flex-col gap-8">

          <h1 className="text-6xl uppercase font-bold text-dark-blue text-center">
            Your
            <span className="text-mid-blue"> Ultimate </span>
            <br/>Exam Preparation Experience
          </h1>

          <p className="font-semibold text-dark-blue text-center">
            A secure, easy-to-use platform designed for students to excel in exams with confidence.
          </p>

          <Button className="bg-mid-blue mx-auto" pill>
            <Link to={'/freetrial'}>Start free trial</Link>
          </Button>
        </div>
      </section>

      <section id="description" className="w-full bg-light-blue">
        <div className="flex flex-col gap-8 p-10 my-4 items-center">
          <h1 className="font-semibold mb-4">Master your exams with ease</h1>

          {descriptionBoxes.map((item, index) => (
            <DescriptionCard
              key={index}
              index={index}
              content={item}
            />
          ))}

        </div>
      </section>

      <section id="reviews" className="p-24 flex flex-wrap gap-16 justify-center lg:justify-between">
        {reviews.map((review, index) => (
          <div key={index} className={`w-80 lg:w-[25vw] h-80 flex flex-col gap-4 items-center justify-center p-8 text-sm rounded-xl drop-shadow-lg bg-[${review.bg}] text-white text-center`}>
            <p className="shadow-none">{review.review}</p>
            <p className="text-light-blue shadow-none">{review.name}, {review.company}t</p>
          </div>
        ))}
      </section>

      <section className="w-full flex flex-col items-center gap-8 bg-light-blue p-20">
        <h1 className="font-semibold">frequently asked questions (FAQs)</h1>
        <div className="flex flex-col gap-4">
          {faq.map((question, index) => (
            <div key={index} className={`w-[30rem] bg-white drop-shadow-xl ${visibleFAQ == index ? "rounded-3xl" : "rounded-full"}`}>
              <button
                className=" px-8 py-3 text-sm font-bold text-left"
                onClick={() => visibleFAQ === index ? setVisibleFAQ(null) : setVisibleFAQ(index)}
              >
                + {question.q}
              </button>
              {visibleFAQ === index &&
                <div className="px-8 pb-3 text-sm">
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
          ))}
        </div>
      </section>

      <section className="bg-mid-blue p-24 flex flex-col items-center gap-6">
          <h1 className="text-5xl text-white font-bold text-center">Join ExamEase to ace your exams.</h1>
          <p className=" text-white font-semibold">Sign up now and explore our comprehensive exam preparation platform.</p>
          <Button className="bg-white mx-auto text-dark-blue font-semibold my-3" pill>
            <Link to={'/freetrial'}>Start free trial</Link>
          </Button>
      </section>

    </main>
  )
}
