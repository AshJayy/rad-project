import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontSize: "10px",
  },
  coverPage: {
    padding: 120,
    fontSize: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    maxWidth: 600,
    paddingVertical: "20px",
    paddingHorizontal: "40px",
    borderRadius: 10,
    dropShadow: "5px 5px 4px rgba(0, 0, 0, 0.25)",
    backgroundColor: "#E2ECF3",
    marginVertical: 16,
  },
  coverHeading: {
    fontSize: "40px",
    fontWeight: 800,
    marginBottom: 16,
    color: "#00072D",
    textAlign: "center",
  },
  coverSubHeading: {
    fontSize: "25px",
    fontWeight: 800,
    marginBottom: 16,
    color: "#064998",
    textAlign: "center",
  },
  captionDiv: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  captionText: {
    fontSize: 10,
    opacity: 0.75,
    fontStyle: "italic",
  },
  score: {
    backgroundColor: "#064998",
    fontSize: "12px",
    color: "#fff",
    maxWidth: 600,
    paddingVertical: "20px",
    paddingHorizontal: "40px",
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  questionText: {
    marginBottom: 5,
  },
  optionContainer: {
    marginLeft: 20,
    paddingVertical: 4,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "4px",
  },
  optionText: {
    paddingLeft: 8,
  },
  radio: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    border: "1px solid #00072D",
  },
  radioCorrect: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  radioIncorrect: {
    backgroundColor: "#F44336",
    borderColor: "#F44336",
  },
  correct: {
    color: "#4CAF50",
  },
  incorrect: {
    color: "#F44336",
  },
  alert: {
    padding: 16,
    marginTop: -12,
    borderRadius: 8,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    alignItems: "center",
  },
  successAlert: {
    backgroundColor: "#DFF2BF",
    color: "#4CAF50",
  },
  failureAlert: {
    backgroundColor: "#FFD2D2",
    color: "#F44336",
  },
  answerContainer: {
    marginTop: 4,
    padding: 16,
    backgroundColor: "#E6DDDA",
    borderRadius: 12,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  },
});

const PdfFile = ({ exam, user }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionPromises = exam.questions.map((question) => {
          return fetch(`/api/question/getquestion/${question._id}`).then(
            async (response) => {
              if (!response.ok) {
                throw new Error(`Error fetching question ${question._id}`);
              }
              const data = await response.json();
              return data;
            }
          );
        });

        const questionsData = await Promise.all(questionPromises);
        setQuestions(questionsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchQuestions();
  }, [exam.questions]);

  return (
    <Document>
      <Page style={styles.coverPage}>
        <Text style={styles.coverHeading}>EXAM REPORT</Text>
        <Text style={styles.coverSubHeading}>EXAM No. {exam.examNo}</Text>
        <View style={styles.captionDiv}>
          <Text style={styles.captionText}>{user.username}</Text>
          <Text style={styles.captionText}>{exam.createdAt.split("T")[0]}</Text>
        </View>
      </Page>
      <Page style={styles.page}>
        <View style={styles.score}>
            <Text>Your score - {exam.totalMarks.toFixed(2)}</Text>
            <Text>Time taken - {(exam.takenTime / 60).toFixed(0)}:{exam.takenTime % 60} min</Text>
        </View>
        {questions.map((question, index) => (
          <View key={index} wrap={false}>
            <View style={styles.container}>
              <Text style={styles.questionText}>
                {index + 1}. {question.content}
              </Text>
              {question.options.map((option, i) => (
                <View key={i} style={styles.optionContainer}>
                  <View
                    style={[
                      styles.radio,
                      i === exam.questions[index].choice &&
                        (exam.questions[index].choice === question.correctAnswer
                          ? styles.radioCorrect
                          : styles.radioIncorrect),
                    ]}
                  ></View>
                  <Text
                    style={[
                      styles.optionText,
                      i === exam.questions[index].choice &&
                        (exam.questions[index].choice === question.correctAnswer
                          ? styles.correct
                          : styles.incorrect),
                    ]}
                  >
                    {option}
                  </Text>
                </View>
              ))}
            </View>
            {exam.questions[index].choice === question.correctAnswer ? (
              <View style={[styles.alert, styles.successAlert]}>
                <FaCheck />
                <Text>Correct Answer</Text>
              </View>
            ) : (
              <>
                <View style={[styles.alert, styles.failureAlert]}>
                  <FaTimes />
                  <Text>Incorrect Answer</Text>
                </View>
                <View style={styles.answerContainer}>
                  <Text>
                    <FaCheck />
                    Answer: {question.options[question.correctAnswer]}
                  </Text>
                  {question.justification && (
                    <Text>
                      <FaCheck />
                      Justification: {question.justification}
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default PdfFile;
