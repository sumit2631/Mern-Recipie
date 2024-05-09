import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OTP = () => {
    const [otp, setOtp] = useState("");
    const { userId } = useParams();
    const navigate = useNavigate();

    const verifyOtp = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/verifyOTP", { sentOtp: otp, userId });
            if (response.status === 200) {
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Enter the OTP</h2>
            <input
                type="text"
                required
                value={otp}
                onChange={(e) => { setOtp(e.target.value) }}
                style={{ margin: "10px", padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <br />
            <button
                onClick={verifyOtp}
                style={{ padding: "10px 20px", margin: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
                Verify
            </button>
        </div>
    );
}

export default OTP;
