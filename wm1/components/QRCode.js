import { useQRCode } from 'next-qrcode'

export default function QRCode() {
    const { Canvas } = useQRCode()
   const baseURL = 'https://kupaktana.com/events/eventDocUploader'
    return (
      <Canvas
        text={`${baseURL}?ev=1`}
        options={{
          type: 'image/jpeg',
          quality: 0.3,
          level: 'M',
          margin: 0,
          scale: 4,
          width: '140',
          color: {
            dark: '#6a737b',
            light: '#f0f0f1',
          },
        }}
      />
    )
  }