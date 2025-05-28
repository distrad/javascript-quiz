import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { useQuestionsStore } from "./store/questions";
import { type Question as QuestionType } from "./types";
import {
  Card,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import SyntaxHighlighter from "react-syntax-highlighter";
import { gradientDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Footer } from "./Footer";

const Question = ({ info }: { info: QuestionType }) => {
  const selectAnswer = useQuestionsStore((state) => state.selectAnswer);
  const createHandleClick = (answerIndex: number) => () => {
    selectAnswer(info.id, answerIndex);
  };

  const getBackgroundColor = (index: number) => {
    const { userSelectedAnswer, correctAnswer } = info;
    if (userSelectedAnswer == null) return "transparent";
    //si ya selecciono pero es incorrecta
    if (index !== correctAnswer && index !== userSelectedAnswer)
      return "transparent";
    //solucion correcta
    if (index === correctAnswer) return "green";
    //seleccion del usuario no es correcta
    if (index === userSelectedAnswer) return "red";
    //ninguna de las anteriores
    return "transparent";
  };

  return (
    <Card
      variant="outlined"
      sx={{ bgcolor: "#222", p: 2, textAlign: "left", mt: 4 }}
    >
      {/* Questions */}
      <Typography variant="h5">{info.question}</Typography>

      {/* Code */}
      <SyntaxHighlighter language="javascript" style={gradientDark}>
        {info.code}
      </SyntaxHighlighter>

      {/* Answers */}
      <List sx={{ bgcolor: "#333" }} disablePadding>
        {info.answers.map((answer, index) => (
          <ListItem key={index} disablePadding divider>
            <ListItemButton
              disabled={info.userSelectedAnswer != null}
              onClick={createHandleClick(index)}
              sx={{ backgroundColor: getBackgroundColor(index) }}
            >
              <ListItemText sx={{ textAlign: "center" }} primary={answer} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export const Game = () => {
  const questions = useQuestionsStore((state) => state.questions);
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const goNextQuestion = useQuestionsStore((state) => state.goNextQuestion);
  const goPreviousQuestion = useQuestionsStore(
    (state) => state.goPreviousQuestion
  );

  const questionInfo = questions[currentQuestion];

  return (
    <>
      <Stack
        direction="row"
        gap={2}
        alignContent="center"
        justifyContent="center"
      >
        <IconButton
          onClick={goPreviousQuestion}
          disabled={currentQuestion === 0}
        >
          <ArrowBackIosNew />
        </IconButton>
        <div style={{ marginTop: "8px" }}>
          {currentQuestion + 1} / {questions.length}
        </div>

        <IconButton
          onClick={goNextQuestion}
          disabled={currentQuestion >= questions.length - 1}
        >
          <ArrowForwardIos />
        </IconButton>
      </Stack>
      <Question info={questionInfo} />
      <Footer />
    </>
  );
};
