import { deskEvents } from "../../../utils/data"

export default async (req, res) => {
    const id = req.query.id
    if (id) {
        const result = await deskEvents(id)
        res.status(200).json(result)
    } else {
        res.status(405).json({ 'error': 'id is missing' })
    }
}