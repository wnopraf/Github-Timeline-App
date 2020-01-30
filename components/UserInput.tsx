export default ({
  setUserName,
  click
}: {
  setUserName: (String) => void
  click: (event) => void
}) => {
  return (
    <div className="input-box">
      <input type="text" onChange={e => setUserName(e.target.value)} />
      <button onClick={click}>enviar</button>
    </div>
  )
}
