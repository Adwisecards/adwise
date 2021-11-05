import React from "react";
import {
    View,
} from "react-native";
import {Page} from "../../../../../components";
import LottieView from "lottie-react-native";

const LoadingPurchase = () => {
    return (
        <Page>

            <LottieView
                style={{flex: 1}}
                source={require('../../../../../../assets/lottie/loading/modal_loading_purchase.json')}
                autoPlay
                loop
            />

        </Page>
    )
}

export default LoadingPurchase
