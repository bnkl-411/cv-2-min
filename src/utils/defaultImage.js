import defaultMalePicture from '../assets/img/default-male.png'
import defaultFemalePicture from '../assets/img/default-female.png'

export const getDefaultPicture = (gender) => {
    return gender === 'male' ? defaultMalePicture : defaultFemalePicture
}

export { defaultMalePicture, defaultFemalePicture }