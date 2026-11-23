import { socialImage, SOCIAL_IMAGE_SIZE } from '@/components/concourse/SocialImage';

export const alt = 'MindDo.AI engineering case study by Olric Zeng — architecture, queues, workers and autoscaling.';
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = 'image/png';

export default function Image() {
    return socialImage('minddo');
}
