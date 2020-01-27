
export default ({ setUserName, getUserHistory }: { setUserName: (String) => void, getUserHistory: (Event) => void }) => {


    return <div className="input-box">
        <input type="text" onChange={(e) => setUserName(e.target.value)} />
        <button onClick={getUserHistory}>enviar</button>
    </div>
}