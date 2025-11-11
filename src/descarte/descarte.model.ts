import * as mongoose from 'mongoose';

export const DescarteSchema = new mongoose.Schema({
  nomeLocal: String,
  bairro: String,
  tipoLocal: String,
  categoriasResiduos: [String],
  nomeUsuario: String,
  tipoResiduo: String,
  data: Date,
});
