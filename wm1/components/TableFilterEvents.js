import VirtualizedSelect from 'react-virtualized-select'
import { vDesks,vWorkers,vCategories } from '../utils/common'

export const TableFilterEvents = ({ type, worker, desk, sKey, cbType, cbDesk, cbWorker, cbSearch, cbClearSearch, cbReset, desks, workers }) => {

    return <div className="d-flex mbt-2">
        <div className="d-inline-block combo-rel">
            <div className="d-inline-block mr-2">
               
                <div className='w-m-150 d-inline-block'>
                    <VirtualizedSelect
                        instanceId={'vCat'}
                        options={vCategories}
                        onChange={(e) => cbType(e.value)}
                        value={type}
                    />
                </div>
            </div>
            <div className="d-inline-block mr-2">              
                <div className='w-m-150 d-inline-block'>
                    <VirtualizedSelect
                        instanceId={'vDesk'}
                        options={vDesks(desks,{ label: 'כל הקופות', value: '' })}                        
                        onChange={(e) => cbDesk(e.value)}
                        value={desk}
                    />
                </div>
            </div>
            <div className="d-inline-block mr-2">               
                <div className='w-m-150 d-inline-block'>
                    <VirtualizedSelect
                        instanceId={'vWorker'}
                        options={vWorkers(workers,{ label:'כל העובדים', value: '' })}
                        onChange={(e) => cbWorker(e.value)}
                        value={worker} 
                    />
                </div>
            </div>
            <div className="d-inline-block">
                <input type="search" className="form-control form-control-sm search-inp" value={sKey}
                    placeholder="חפש לפי" onChange={(e) => cbSearch(e)} onInput={(e) => cbClearSearch(e)} />
            </div>
        </div>

        <div className="ml-auto d-inline-block">           
            <button className="btn btn-sm btn-outline-secondary" onClick={() => {
                cbReset()
                $('.search-inp').val('')
            }
            }>איתחול</button>
        </div>
    </div>
}