import { Banco } from "./banco";
import { Msisdn } from "./msisdn";

export class ComprasLog{
    id: number;
    codigo_accion: string;
    codigo_respuesta: string;
    descripcion_respuesta: string;
    exito: number;
    fechahora: string;
    monto_acreditado: string;
    monto_cobrado: string;
    nro_factura: string;
    nro_transaccion: string;
    plataforma: string;
    banco: Banco;
    msisdn_epin: Msisdn;
    nroTimbrado: string;
    fechaHastaTimbrado: string;
}