import { useParams } from 'react-router';
import { Link } from 'react-router-dom';


import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import deleteimg from '../assets/images/delete.svg';
import logoImg from '../assets/images/logo.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Question } from '../components/Questions';

import '../styles/room.scss';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import { useHistory } from 'react-router-dom';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory()
    const params = useParams<RoomParams>();

    const roomId = params.id;
    const { title, questions } = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            andedAt: new Date(),
        })

        history.push('/');
    }

async  function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Confirma a Exclusao dessa pergunta ?')) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: true,
        })
    }


    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <Link to="/"><img src={logoImg} alt="Letmeask" /></Link>
                    <RoomCode code={roomId} />
                    <Button onClick={handleEndRoom}>Encerrar</Button>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>{ title }</h1>
                    {questions.length > 0 && <span>{questions.length} peguntas</span>}
                </div>

                <div className="quest-list">
                    
                {questions.map(questions => {
                    return (
                        <Question
                            key={questions.id}
                            content={questions.content}
                            author={questions.author}
                            isAnswered={questions.isAnswered}
                            isHighlighted={questions.isHighLighted}
                        >
                        
                            {!questions.isAnswered && (
                                <>
                            <button
                                type="button"
                                onClick={() => handleCheckQuestionAsAnswered(questions.id)}
                            >
                                <img src={checkImg} alt="Marca  Pergunta Como Respondida" />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleHighlightQuestion(questions.id)}
                            >
                                <img src={answerImg} alt="Dar Destaque a Pergunta" />
                            </button>
                                </>
                    )}

                            <button
                                type="button"
                                onClick={() => handleDeleteQuestion(questions.id)}
                            >
                                <img src={deleteimg} alt="Apaga Pergunta" />
                            </button>


                        </Question>
                    );
                })}
                </div>

            </main>
        </div>
    );
}