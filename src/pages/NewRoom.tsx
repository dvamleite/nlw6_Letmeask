import { FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { database } from '../services/firebase';

export function NewRoom() {
    const { user } = useAuth()
    const history = useHistory()
    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if (newRoom.trim() === '') {
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        history.push(`/rooms/${firebaseRoom.key}`)
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
                    <h2>Criar uma Nova Sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome Da Sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button
                            type="submit">
                            Criar Sala
                        </Button>
                    </form>
                    <p>
                        Quer Entra Em Uma Sala Existente <Link to="/">Clique Aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}