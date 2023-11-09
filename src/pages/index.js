import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Table from '@/components/Table'
import Thead from '@/components/Thead'
import Tbody from '@/components/Tbody'
import Tr from '@/components/Tr'
import Th from '@/components/Th'
import { useEffect, useState } from 'react'
import Td from '@/components/Td'
import axios from 'axios'
import { formatarData } from '@/utils/formatarData'

export default function Home() {

  const [reservas, setReservas] = useState();

  const [message, setMessage] = useState({
    type: "",
    content: ""
  });

  const [dados, setDados] = useState({
    descricao: "",
    sala: "",
    inicio: "",
    solicitante: "",
    fim: "",
    acordo: false
  })

  async function buscarReservas() {
    try {
      const res = await axios.get("http://localhost:3001/reservas");

      setReservas(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function reservarSala(e) {
    e.preventDefault();
    setMessage({ type: "", content: "" })

    try {
      const res = await axios.post("http://localhost:3001/reservas", {
        descricao: dados.descricao,
        sala: dados.sala,
        inicio: dados.inicio,
        solicitante: dados.solicitante,
        fim: dados.fim,
        acordo: dados.acordo
      });


      if (!dados.acordo) return setMessage({ type: "error", content: "Aceite os termos para cadastrar !" })

      if (dados.inicio > dados.fim) return setMessage({ type: "error", content: "Data início é menor que a data final !" })

      setMessage({ type: "success", content: "Reserva cadastrada com sucesso !" })

      buscarReservas();

      setDados({
        descricao: "",
        sala: "",
        inicio: "",
        solicitante: "",
        fim: "",
        acordo: false
      })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    buscarReservas();
  }, [])

  return (
    <>
      <Head>
        <title>Agendamentos</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" />
      </Head>

      <div className={styles.containerPage}>
        <header className={styles.header}>
          <h1 className={styles.titulo}>Reserva de Salas</h1>
        </header>


        <main className={styles.containerMain}>
          <div className={styles.containerForm}>
            <p className={styles.containerTitulo}>✍️ Reservar sala</p>
            {message.content && <p style={{ backgroundColor: message.type === "error" ? "red" : "green" }} className={styles.acordo}>{message.content}</p>}
            <form className={styles.form} onSubmit={e => reservarSala(e)}>
              <div className={styles.formItem}>
                <label htmlFor='descricao' className={styles.label}>Descrição:</label>
                <textarea id="decricao" className={styles.textarea} cols={30} rows={3}
                  required={true} value={dados.descricao} onChange={e => setDados((data) => ({ ...data, descricao: e.target.value }))}></textarea>
              </div>
              <div className={styles.formItem}>
                <label className={styles.label} htmlFor="solicitante">Solicitante:</label>
                <input required={true} id='solicitante' className={styles.input} type="text"
                  value={dados.solicitante} onChange={e => setDados((data) => ({ ...data, solicitante: e.target.value }))} />
              </div>
              <div className={styles.formItem}>
                <label className={styles.label} htmlFor="sala">Sala:</label>
                <input required={true} id='sala' className={styles.input} type="text"
                  value={dados.sala} onChange={e => setDados((data) => ({ ...data, sala: e.target.value }))} />
              </div>
              <div className={styles.formItem}>
                <label className={styles.label} htmlFor="dataInicial">Início:</label>
                <input required={true} id='dataInicial' className={styles.input} type="datetime-local"
                  value={dados.inicio} onChange={e => setDados((data) => ({ ...data, inicio: e.target.value }))} />
              </div>
              <div className={styles.formItem}>
                <label className={styles.label} htmlFor="dataFinal">Fim:</label>
                <input required={true} id='dataFinal' className={styles.input} type="datetime-local"
                  value={dados.fim} onChange={e => setDados((data) => ({ ...data, fim: e.target.value }))} />
              </div>
              <div>
                <input type="checkbox" id='acordo'
                  checked={dados.acordo} onChange={e => setDados((data) => ({ ...data, acordo: e.target.checked }))} />
                <label style={{ marginLeft: "1rem" }} className={styles.label} htmlFor="acordo">Estou de acordo com os termos</label>
              </div>
              <div className={styles.containerButton}>
                <button type="submit" className={styles.button}>Reservar Sala</button>
              </div>
            </form>
          </div>

          <div className={styles.containerTable}>
            <p className={styles.containerTitulo}>📅 Reservas Realizadas: {reservas?.length}</p>
            <Table>
              <Thead>
                <Tr>
                  <Th>Descrição</Th>
                  <Th>Solicitante</Th>
                  <Th>Sala</Th>
                  <Th>Início</Th>
                  <Th>Fim</Th>
                </Tr>
              </Thead>
              <Tbody>
                {reservas?.map((reserva) => (
                  <Tr key={reserva.id}>
                    <Td>{reserva.descricao}</Td>
                    <Td>{reserva.solicitante}</Td>
                    <Td>{reserva.sala}</Td>
                    <Td>{formatarData(reserva.inicio)}</Td>
                    <Td>{formatarData(reserva.fim)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        </main>
      </div>
    </>
  )
}
