export const formatarData = (data) => {
  const [ano, mes, resto] = data.split('-')
  const [dia, horas] = resto.split('T')
  const [hora,minutos] = horas.split(":")

  
  return `${dia}/${mes}/${ano} às ${hora}:${minutos}:00`

}