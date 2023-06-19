import { getDesksByWorker } from '../../../utils/requestUtils'

export default async (req, res) => {
        await getDesksByWorker(req, res)
}