import {mailExists} from '../../../utils/requestUtils'

export default async (req, res) => {
        await mailExists(req,res)       
}