import { socialImage, PORTFOLIO_IMAGE_SIZE } from '@/components/concourse/SocialImage';

export const alt = 'Olric Zeng — personal portfolio.';
export const size = PORTFOLIO_IMAGE_SIZE;
export const contentType = 'image/png';

export default function Image() {
    return socialImage('portfolio');
}
