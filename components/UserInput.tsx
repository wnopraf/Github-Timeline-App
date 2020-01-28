export default ({
  setUserName,
  userName,
  requestUserRepoData,
  setRepoData
}: {
  setUserName: (String) => void
  userName: string
  setRepoData
  requestUserRepoData: (variables: {
    userName: string
    endCursor?: string
  }) => Promise<any>
}) => {
  const clickEvent = async click => {
    const data = await requestUserRepoData({ userName })
    console.log(data, 'graph data')

    setRepoData(data)
  }
  return (
    <div className="input-box">
      <input type="text" onChange={e => setUserName(e.target.value)} />
      <button onClick={clickEvent}>enviar</button>
    </div>
  )
}
