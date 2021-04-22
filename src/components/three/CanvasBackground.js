const CanvasBackground = ({ children }) => {
    return (
        <div style={styles.bg}>
            <div style={styles.inner}>{children}</div>
        </div>
    )
}

export default CanvasBackground

const styles = {
    inner: {
        height: "100%",
        backgroundImage:
            "linear-gradient(45deg, rgb(220,220,220) 25%, transparent 25%), linear-gradient(-45deg, rgb(220,220,220) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgb(220,220,220) 75%), linear-gradient(-45deg, transparent 75%, rgb(220,220,220) 75%)",
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
    },
    bg: {
        height: "80vh",
        overflow: "hidden",
        background: "white"
    },
}
