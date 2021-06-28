import { useHistory } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

//icons inports
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';



export function Home() {

    const history = useHistory();

    const { user, signInWithGoogle } = useAuth()
    
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle()
        }
       

        history.push('/rooms/news');
    }

    function providerAlert() {
        alert('Em Fase De Construção !');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            alert('Room does not exists..');
            return;
        }

        if (roomRef.val().andedAt) {
            alert('Room already closed.');
            return;
        }

        history.push(`/rooms/${roomCode}`);

    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="ilustração de perguntas e respotas" />
                <strong>Criar Salas de Q&amp;A ao-vivo</strong>
                <p>Tire as Dúvidas da sua audiência em tempo- real</p>
            </aside>
            <main>

                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />

                    <div className="icons">

                        <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="logo do google" />                        
                        </button>

                         <button onClick={providerAlert} className="create-room">
                        <GitHubIcon className="github" />                       
                        </button>

                         <button onClick={providerAlert} className="create-room">
                        <LinkedInIcon className="linkdin" />                        
                        </button>
                        
                    </div>

                    <div className="separetor">
                        ou Entre em uma sala
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o Código da Sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button
                            type="submit">
                            Entra na Sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}

