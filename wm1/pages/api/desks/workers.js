import { getWorkersByDesk } from '../../../utils/requestUtils'

export default async (req, res) => {       
        await getWorkersByDesk(req, res)
}