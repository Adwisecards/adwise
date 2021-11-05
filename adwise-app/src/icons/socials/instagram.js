import React from 'react';
import Svg, {
    Path,
    Circle
} from "react-native-svg";

const IconInstagram = (props) => {

    return (
        <Svg width="100%" height="100%" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M5.99738 1.83225C7.35588 1.83225 7.51535 1.83832 8.05229 1.86263C8.54886 1.8849 8.81733 1.96793 8.99698 2.03881C9.23517 2.13197 9.40473 2.24133 9.58237 2.41954C9.76 2.59775 9.87102 2.76786 9.96186 3.00682C10.0305 3.18706 10.1153 3.4564 10.1375 3.95458C10.1617 4.49327 10.1678 4.65325 10.1678 6.01616C10.1678 7.37907 10.1617 7.53906 10.1375 8.07774C10.1153 8.57592 10.0325 8.84526 9.96186 9.0255C9.869 9.26447 9.76 9.43458 9.58237 9.61279C9.40473 9.791 9.23517 9.90238 8.99698 9.99351C8.81733 10.0624 8.54886 10.1474 8.05229 10.1697C7.51535 10.194 7.35588 10.2001 5.99738 10.2001C4.63888 10.2001 4.47941 10.194 3.94247 10.1697C3.44591 10.1474 3.17744 10.0644 2.99778 9.99351C2.75959 9.90035 2.59003 9.791 2.4124 9.61279C2.23476 9.43458 2.12374 9.26447 2.03291 9.0255C1.96427 8.84526 1.87949 8.57592 1.85729 8.07774C1.83307 7.53906 1.82701 7.37907 1.82701 6.01616C1.82701 4.65325 1.83307 4.49327 1.85729 3.95458C1.87949 3.4564 1.96226 3.18706 2.03291 3.00682C2.12576 2.76786 2.23476 2.59775 2.4124 2.41954C2.59003 2.24133 2.75959 2.12994 2.99778 2.03881C3.17744 1.96996 3.44591 1.8849 3.94247 1.86263C4.47941 1.8363 4.6409 1.83225 5.99738 1.83225ZM5.99738 0.912842C4.61668 0.912842 4.44308 0.918917 3.90008 0.943219C3.35911 0.96752 2.98971 1.0546 2.66674 1.18016C2.33165 1.30977 2.04905 1.48595 1.76645 1.76947C1.48385 2.05299 1.31026 2.33853 1.17905 2.67268C1.0539 2.9967 0.967099 3.3673 0.942876 3.91205C0.918653 4.45479 0.912598 4.62895 0.912598 6.01414C0.912598 7.39932 0.918653 7.57348 0.942876 8.11824C0.967099 8.66098 1.0539 9.03158 1.17905 9.35762C1.30824 9.69379 1.48385 9.97731 1.76645 10.2608C2.04905 10.5443 2.33367 10.7185 2.66674 10.8501C2.98971 10.9757 3.35911 11.0628 3.9021 11.0871C4.4451 11.1114 4.61668 11.1175 5.9994 11.1175C7.38212 11.1175 7.5537 11.1114 8.0967 11.0871C8.63767 11.0628 9.00707 10.9757 9.33206 10.8501C9.66715 10.7205 9.94975 10.5443 10.2323 10.2608C10.5149 9.97731 10.6885 9.69177 10.8197 9.35762C10.9449 9.0336 11.0317 8.663 11.0559 8.11824C11.0801 7.57348 11.0862 7.40135 11.0862 6.01414C11.0862 4.62692 11.0801 4.45479 11.0559 3.91003C11.0317 3.3673 10.9449 2.9967 10.8197 2.67065C10.6906 2.33448 10.5149 2.05096 10.2323 1.76745C9.94975 1.48393 9.66513 1.30977 9.33206 1.17813C9.00909 1.05258 8.63969 0.965495 8.0967 0.941194C7.55168 0.918917 7.37808 0.912842 5.99738 0.912842Z" fill={ props.color }/>
            <Path d="M5.9968 3.396C4.55554 3.396 3.38477 4.56854 3.38477 6.01651C3.38477 7.46448 4.55352 8.63702 5.9968 8.63702C7.44008 8.63702 8.60883 7.46448 8.60883 6.01651C8.60883 4.56854 7.44008 3.396 5.9968 3.396ZM5.9968 7.71559C5.06018 7.71559 4.3012 6.95414 4.3012 6.01448C4.3012 5.07483 5.06018 4.31338 5.9968 4.31338C6.93341 4.31338 7.6924 5.07483 7.6924 6.01448C7.6924 6.95414 6.93341 7.71559 5.9968 7.71559Z" fill={ props.color }/>
            <Path d="M8.71215 3.90225C9.04882 3.90225 9.32176 3.62844 9.32176 3.29067C9.32176 2.95289 9.04882 2.67908 8.71215 2.67908C8.37547 2.67908 8.10254 2.95289 8.10254 3.29067C8.10254 3.62844 8.37547 3.90225 8.71215 3.90225Z" fill={ props.color }/>
        </Svg>
    )
}

IconInstagram.defaultProps = {
    color: "#3866BB"
}

export default IconInstagram