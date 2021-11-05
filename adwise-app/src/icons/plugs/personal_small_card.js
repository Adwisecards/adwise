import React from 'react';
import PropTypes from 'prop-types';
import Svg, {
    Path,
    G
} from 'react-native-svg';

const PersonalSmallCard = (props) => {
    const { color, height, width } = props;

    return (
        <Svg width={ width } style={props.style} height={ height } viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M35.4994 70.241C54.6273 70.241 70.1335 54.7112 70.1335 35.5541C70.1335 16.397 54.6273 0.867065 35.4994 0.867065C16.3715 0.867065 0.865234 16.397 0.865234 35.5541C0.865234 54.7112 16.3715 70.241 35.4994 70.241Z" fill="white"/>
            <Path d="M30.0891 8.45484C49.2461 8.45484 64.7232 23.9556 64.7232 43.1418C64.7232 48.9953 63.3162 54.5235 60.7187 59.293C66.5632 53.1143 70.1348 44.7678 70.1348 35.5541C70.1348 16.3678 54.6577 0.867065 35.5007 0.867065C22.1882 0.867065 10.6074 8.34645 4.87109 19.4029C11.1485 12.5739 20.1318 8.45484 30.0891 8.45484Z" fill={ props.color } fillOpacity="0.4"/>
            <Path d="M35.5008 70.241C45.7828 70.241 55.0908 65.6884 61.3682 58.5342C60.827 54.8487 58.013 51.8136 54.2249 51.1632L46.9734 49.8624C46.5405 49.754 45.9993 49.6456 45.5664 49.4288H25.2188C24.7859 49.6456 24.353 49.754 23.8118 49.8624L16.5603 51.1632C12.7722 51.8136 9.95815 54.8487 9.41699 58.5342C15.9109 65.6884 25.1106 70.241 35.5008 70.241Z" fill={ props.color } fillOpacity="0.4"/>
            <Path d="M37.1227 64.8212C45.5648 63.3036 53.5739 59.4013 57.2538 52.2472C56.2797 51.5968 55.5221 51.38 54.3315 51.1632L47.08 49.8624C46.6471 49.754 46.1059 49.6456 45.673 49.4288H25.2172C24.7843 49.6456 24.3514 49.754 23.8102 49.8624L16.5587 51.1632C13.0953 51.7052 10.4977 54.3067 9.63184 57.5586C9.74007 57.667 9.8483 57.667 9.95653 57.7754C17.4245 63.7372 27.0571 66.6639 37.1227 64.8212Z" fill="white"/>
            <Path d="M35.5008 71C25.4353 71 15.6944 66.6642 8.98404 59.0764C8.87581 58.8596 8.76758 58.6428 8.76758 58.426C9.30874 54.3069 12.4475 51.055 16.5603 50.4046L23.8118 49.1039C24.2447 48.9955 24.5694 48.8871 25.0023 48.7787C25.1106 48.7787 25.2188 48.6703 25.327 48.6703H45.7828C45.8911 48.6703 45.9993 48.6703 46.1075 48.7787C46.4322 48.9955 46.8651 49.1039 47.2981 49.1039L54.5496 50.4046C58.6624 51.1634 61.6929 54.3069 62.3423 58.426C62.3423 58.6428 62.3423 58.8596 62.1258 59.0764C55.199 66.6642 45.5664 71 35.5008 71ZM10.3911 58.3176C16.885 65.3634 25.9764 69.3741 35.5008 69.3741C45.0252 69.3741 54.1167 65.3634 60.5023 58.3176C59.853 55.0657 57.3636 52.5726 54.1167 52.0306L46.8651 50.7298C46.4322 50.6214 45.8911 50.513 45.4581 50.2962H25.4353C25.0023 50.513 24.5694 50.6214 24.0283 50.7298L16.7767 52.0306C13.5298 52.5726 11.0404 55.0657 10.3911 58.3176Z" fill={ props.color }/>
            <Path d="M29.2223 42.7086L28.4647 45.6353C28.0318 47.3697 26.8412 48.7788 25.2178 49.5376L35.3916 56.9086L45.5653 49.5376C43.9419 48.7788 42.7513 47.3697 42.3184 45.6353L41.5608 42.7086H29.2223Z" fill="white"/>
            <Path d="M40.5872 53.2231L45.6741 49.5376C44.0507 48.7788 42.8601 47.3697 42.4272 45.6353L41.6696 42.7086H36.3662L37.665 48.0201C38.2062 50.0796 39.1802 51.8139 40.5872 53.2231Z" fill={ props.color } fillOpacity="0.4"/>
            <Path d="M35.5007 57.667C35.2843 57.667 35.176 57.667 35.0678 57.5586L24.894 50.1876C24.6776 49.9708 24.5693 49.754 24.5693 49.4288C24.5693 49.1037 24.7858 48.8869 25.0023 48.7785C26.4093 48.1281 27.3834 46.9357 27.8163 45.4182L28.5739 42.4914C28.6821 42.1663 29.0068 41.8411 29.3315 41.8411H41.7782C42.1029 41.8411 42.4276 42.0579 42.5358 42.4914L43.2934 45.4182C43.6181 46.9357 44.7004 48.1281 46.1074 48.7785C46.3239 48.8869 46.5404 49.1037 46.5404 49.4288C46.5404 49.754 46.4321 49.9708 46.2157 50.1876L36.0419 57.5586C35.8254 57.667 35.609 57.667 35.5007 57.667ZM26.734 49.6456L35.5007 55.9327L44.1593 49.6456C42.8605 48.7785 41.9946 47.4777 41.5617 45.8517L41.0206 43.5754H29.8727L29.3315 45.8517C28.8986 47.3693 28.0328 48.6701 26.734 49.6456Z" fill={ props.color }/>
            <Path d="M47.7305 30.8932C47.7305 39.2398 42.2107 45.9604 35.3921 45.9604C28.5735 45.9604 23.0537 39.2398 23.0537 30.8932C23.0537 22.5467 28.5735 18.2108 35.3921 18.2108C42.2107 18.2108 47.7305 22.5467 47.7305 30.8932Z" fill="white"/>
            <Path d="M35.4999 18.2108C34.4176 18.2108 33.3352 18.3192 32.2529 18.536C37.4481 19.7284 41.3444 23.9558 41.3444 30.8932C41.3444 37.8306 37.4481 43.6841 32.2529 45.4184C33.3352 45.7436 34.4176 45.9604 35.4999 45.9604C42.3185 45.9604 47.8383 39.2398 47.8383 30.8932C47.7301 22.5467 42.2102 18.2108 35.4999 18.2108Z" fill={ props.color } fillOpacity="0.4"/>
            <Path d="M35.5 46.7192C28.2485 46.7192 22.404 39.565 22.404 30.8932C22.2957 22.7635 27.5991 17.3436 35.5 17.3436C43.4009 17.3436 48.5961 22.7635 48.5961 30.8932C48.5961 39.565 42.6433 46.7192 35.5 46.7192ZM35.5 18.9696C28.4649 18.9696 24.0274 23.6306 24.0274 30.8932C24.0274 38.6978 29.2226 45.0932 35.5 45.0932C41.7775 45.0932 46.9726 38.6978 46.9726 30.8932C46.9726 23.6306 42.4268 18.9696 35.5 18.9696Z" fill={ props.color }/>
            <Path d="M35.3921 27.5328C30.3052 25.6901 25.976 26.1237 23.5949 26.7741C23.2702 27.9664 23.0537 29.3756 23.0537 30.8931C23.0537 39.2397 28.5735 45.9603 35.3921 45.9603C42.2107 45.9603 47.7305 39.2397 47.7305 30.8931C47.7305 29.8092 47.6223 28.8336 47.5141 27.9664C44.7001 28.6168 40.0461 29.2672 35.3921 27.5328Z" fill="white"/>
            <Path d="M47.5131 27.8579C46.2143 28.1831 44.5908 28.5083 42.7509 28.6167C42.8591 29.3755 42.8591 30.1342 42.8591 30.893C42.8591 37.5052 39.7204 43.2503 35.0664 45.8518C35.1746 45.8518 35.2829 45.8518 35.3911 45.8518C42.2097 45.8518 47.7295 39.1312 47.7295 30.7846C47.7295 29.8091 47.7295 28.8335 47.5131 27.8579Z" fill={ props.color } fillOpacity="0.4"/>
            <Path d="M35.4994 46.7193C28.2478 46.7193 22.4033 39.5651 22.4033 30.8934C22.4033 29.3758 22.6198 27.9667 22.9445 26.5575C23.0527 26.2323 23.2692 26.0155 23.4856 26.0155C26.1914 25.3651 30.5207 24.9315 35.7158 26.7743C40.1533 28.4002 44.4826 27.8583 47.2966 27.0995C47.5131 26.9911 47.7295 27.0995 47.946 27.2079C48.1625 27.3163 48.2707 27.5331 48.2707 27.7499C48.4872 28.7254 48.5954 29.8094 48.5954 30.8934C48.5954 39.5651 42.6427 46.7193 35.4994 46.7193ZM24.3515 27.4247C24.135 28.5086 24.0268 29.701 24.0268 30.8934C24.0268 38.6979 29.2219 45.0934 35.4994 45.0934C41.7768 45.0934 46.9719 38.6979 46.9719 30.8934C46.9719 30.243 46.9719 29.5926 46.8637 28.9422C43.8332 29.5926 39.5039 29.9178 35.1747 28.4002C30.6289 26.6659 26.8408 26.8827 24.3515 27.4247Z" fill={ props.color }/>
        </Svg>
    )
}

PersonalSmallCard.defaultProps = {
    height: 71,
    width: 71,
}

PersonalSmallCard.propTypes = {
    color: PropTypes.string.isRequired,
}

export default PersonalSmallCard