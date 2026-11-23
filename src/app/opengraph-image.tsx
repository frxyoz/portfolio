import { socialImage, SOCIAL_IMAGE_SIZE } from '@/components/concourse/SocialImage';

export const alt = 'Olric Zeng — Computer Science at Cornell. Web apps and infrastructure.';
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = 'image/png';

export default function Image() {
    return socialImage('portfolio');
}
