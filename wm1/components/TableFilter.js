import VirtualizedSelect from 'react-virtualized-select'
import { vTypes } from '../utils/common'

export const TableFilter = ({ tp, arc, sKey, cbArc, cbSearch, cbClearSearch, cbReset }) => {

    return <div className="d-flex mbt-2">
        <div className="d-inline-block combo-rel">
            <div className="d-inline-block mr-2">               
                <div className='w-m-150 d-inline-block'>
                    <VirtualizedSelect
                        instanceId={'vType'}
                        options={vTypes(tp)}
                        onChange={(e) => cbArc(e.value)}
                        value={arc}
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