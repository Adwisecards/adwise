import React from 'react';
import Svg, {
    Circle,
    Rect,
    Path,
    G,
    Defs,
    ClipPath
} from 'react-native-svg';

const ScoreQrCode = (props) => {
    return (
        <Svg width="100%" height="100%" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G clip-path="url(#clip0)">
                <Path d="M29.7084 11.2323C28.9941 11.2323 28.4167 10.6537 28.4167 9.94066V3.81816C28.4167 3.13745 27.8626 2.58333 27.1832 2.58333H21.0607C20.3464 2.58333 19.769 2.00466 19.769 1.29166C19.769 0.578659 20.3464 -7.62939e-06 21.0607 -7.62939e-06H27.1832C29.2886 -7.62939e-06 31.0001 1.71274 31.0001 3.81816V9.94066C31.0001 10.6537 30.4227 11.2323 29.7084 11.2323Z" fill="#ED8E00"/>
                <Path d="M1.29167 11.2323C0.577375 11.2323 0 10.6537 0 9.94067V3.81817C0 1.71275 1.71146 0 3.81688 0H9.93938C10.6537 0 11.231 0.578667 11.231 1.29167C11.231 2.00467 10.6537 2.58333 9.93938 2.58333H3.81688C3.13746 2.58333 2.58333 3.13746 2.58333 3.81817V9.94067C2.58333 10.6537 2.00596 11.2323 1.29167 11.2323Z" fill="#ED8E00"/>
                <Path d="M27.1832 31H21.0607C20.3464 31 19.769 30.4213 19.769 29.7083C19.769 28.9953 20.3464 28.4167 21.0607 28.4167H27.1832C27.8626 28.4167 28.4167 27.8625 28.4167 27.1818V21.0593C28.4167 20.3463 28.9941 19.7677 29.7084 19.7677C30.4227 19.7677 31.0001 20.3463 31.0001 21.0593V27.1818C31.0001 29.2873 29.2886 31 27.1832 31Z" fill="#ED8E00"/>
                <Path d="M9.93938 31H3.81688C1.71146 31 0 29.2873 0 27.1818V21.0593C0 20.3463 0.577375 19.7677 1.29167 19.7677C2.00596 19.7677 2.58333 20.3463 2.58333 21.0593V27.1818C2.58333 27.8625 3.13746 28.4167 3.81688 28.4167H9.93938C10.6537 28.4167 11.231 28.9953 11.231 29.7083C11.231 30.4213 10.6537 31 9.93938 31Z" fill="#ED8E00"/>
                <Path d="M12.2423 14.4137H5.81242C5.09813 14.4137 4.52075 13.835 4.52075 13.122V5.8125C4.52075 5.0995 5.09813 4.52084 5.81242 4.52084H12.2423C12.9566 4.52084 13.534 5.0995 13.534 5.8125V13.122C13.534 13.835 12.9553 14.4137 12.2423 14.4137ZM7.10409 11.8304H10.9507V7.10417H7.10409V11.8304Z" fill="#ED8E00"/>
                <Path d="M25.1876 26.4792H19.0522C18.3379 26.4792 17.7605 25.9005 17.7605 25.1875V21.0774C17.7605 20.3644 18.3379 19.7858 19.0522 19.7858C19.7665 19.7858 20.3438 20.3644 20.3438 21.0774V23.8958H23.8959V20.0208H22.3692C21.6549 20.0208 21.0775 19.4422 21.0775 18.7292C21.0775 18.0162 21.6549 17.4375 22.3692 17.4375H25.1876C25.9019 17.4375 26.4792 18.0162 26.4792 18.7292V25.1875C26.4792 25.9005 25.9019 26.4792 25.1876 26.4792Z" fill="#ED8E00"/>
                <Path d="M25.1875 12.3884H19.9032C19.1889 12.3884 18.6116 11.8097 18.6116 11.0967V5.8125C18.6116 5.0995 19.1889 4.52084 19.9032 4.52084H25.1875C25.9017 4.52084 26.4791 5.0995 26.4791 5.8125V11.0967C26.4791 11.8097 25.9017 12.3884 25.1875 12.3884ZM21.1949 9.80505H23.8958V7.10417H21.1949V9.80505Z" fill="#ED8E00"/>
                <Path d="M16.1173 18.259H5.81242C5.09813 18.259 4.52075 17.6803 4.52075 16.9673C4.52075 16.2543 5.09813 15.6757 5.81242 15.6757H14.8257V6.98662C14.8257 6.27362 15.403 5.69495 16.1173 5.69495C16.8316 5.69495 17.409 6.27362 17.409 6.98662V16.9673C17.409 17.6803 16.8303 18.259 16.1173 18.259Z" fill="#ED8E00"/>
                <Path d="M19.6979 17.9361C18.9836 17.9361 18.4062 17.3574 18.4062 16.6444V14.8839C18.4062 14.1709 18.9836 13.5922 19.6979 13.5922H25.5104C26.2247 13.5922 26.8021 14.1709 26.8021 14.8839C26.8021 15.5969 26.2247 16.1755 25.5104 16.1755H20.9896V16.6444C20.9896 17.3574 20.4122 17.9361 19.6979 17.9361Z" fill="#ED8E00"/>
                <Path d="M15.5282 24.8013C14.8139 24.8013 14.2366 24.2226 14.2366 23.5096V20.575C14.2366 19.862 14.8139 19.2833 15.5282 19.2833C16.2425 19.2833 16.8199 19.862 16.8199 20.575V23.5096C16.8199 24.2226 16.2425 24.8013 15.5282 24.8013Z" fill="#ED8E00"/>
                <Path d="M11.9478 26.4792H5.81242C5.09813 26.4792 4.52075 25.9005 4.52075 25.1875V20.491C4.52075 19.778 5.09813 19.1993 5.81242 19.1993H11.9478C12.6621 19.1993 13.2395 19.778 13.2395 20.491V25.1875C13.2395 25.9005 12.6621 26.4792 11.9478 26.4792ZM7.10409 23.8958H10.6562V21.7827H7.10409V23.8958Z" fill="#ED8E00"/>
            </G>
            <Defs>
                <ClipPath id="clip0">
                    <Rect width="100%" height="100%" fill="white"/>
                </ClipPath>
            </Defs>
        </Svg>

    )
}

export default ScoreQrCode