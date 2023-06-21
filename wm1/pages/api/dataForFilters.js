import {filterData} from '../../utils/data'

export default async (req, res) => {
    let data = await filterData()
    res.json(data) 
}