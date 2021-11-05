const FlagGold = ({ color }) => {
    return (
        <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M0 1C0 0.447715 0.447715 0 1 0H14C14.5523 0 15 0.447715 15 1V17.2895C15 18.0544 14.176 18.5361 13.5094 18.1609L7.99057 15.0539C7.686 14.8825 7.314 14.8825 7.00943 15.0539L1.49057 18.1609C0.823959 18.5361 0 18.0544 0 17.2895V1Z"
                fill="url(#paint0_linear)"/>
            <defs>
                <linearGradient id="paint0_linear" x1="7.5" y1="0" x2="7.5" y2="19" gradientUnits="userSpaceOnUse">
                    <stop stopColor={ color }/>
                    <stop offset="1" stopColor={ color }/>
                </linearGradient>
            </defs>
        </svg>
    )
}

FlagGold.defaultColor = {
  color: '#ED8E00'
};

export default FlagGold