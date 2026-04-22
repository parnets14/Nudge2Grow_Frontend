import { getImageUrl } from '../../utils/imageUrl';

const Image = ({ src, alt, ...props }) => {
  return <img src={getImageUrl(src)} alt={alt} {...props} />;
};

export default Image;
