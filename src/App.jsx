
function App() {

  return (
    <div
      style={{
        width: "100%",
        height: "95vh",
        display: "flex",
        justifyItems: 'center',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <iframe
        src="https://dev.ottermap.com/terraorder?auth=9d62b353b17045f2aa6fc5c77a6b87876404621d"
        width="80%"
        height="90%"
        style={{ border: "none" }}
        title="OtterMap TerraOrder"
      />
    </div>
  )
}

export default App
