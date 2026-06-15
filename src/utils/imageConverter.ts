import axios from 'axios';

export async function convertImageUrlToBase64(
    imageurl: string,
): Promise<string> {
    try {
        const oResposne = await axios.get(imageurl, {
            responseType: 'arraybuffer',
        });
        const buffer = Buffer.from(oResposne.data, 'binary');
        return `data:image/png;base64,${buffer.toString('base64')}`;
    } catch (error: unknown) {
        throw error;
    }
}
