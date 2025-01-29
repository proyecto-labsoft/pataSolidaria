import ItemDato from './itemDato';

interface Props {
    data: string | boolean,
    label: string,
    icono?: React.ReactNode
}
const ItemFamiliar = ({data,label,icono} : Props) => {
    return (

        <ItemDato label={label} data={data} icono={icono} />
        
    )
}

export default ItemFamiliar