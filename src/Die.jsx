import './App.css'
export default function Die(props){

    const pipPositions = [
        ['center'], //1
        ['top-left', 'bottom-right'], //2
        ['top-left', 'center', 'bottom-right'], // 3
        ['top-left', 'top-right', 'bottom-left', 'bottom-right'], // 4
        ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'], // 5
        ['top-left', 'top-right', 'mid-left', 'mid-right', 'bottom-left', 'bottom-right'], // 6
    ];

    const styles = {
        backgroundColor: props.isHeld ? "#FFFBEA" : "white",
        border: props.isHeld ? "3px solid #D4AF37" : "3px solid transparent",
        boxShadow: props.isHeld ? "0 0 8px rgba(212, 175, 55, 0.3)" : "none",
        transform: props.isHeld ? "translateY(-2px)" : "none"
    }

    // Safeguard: make sure value stays between 1 and 6
    const faceIndex = Math.min(Math.max(props.value, 1), 6) - 1;
    const activePips = pipPositions[faceIndex] || [];

    return (
        <button className="dice-face" style={styles} onClick={props.hold}>
            {activePips.map((positionClass, index) => (
                <span key={index} className={`pip ${positionClass}`}></span>
            ))}
        </button>
    )
}