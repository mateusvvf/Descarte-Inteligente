import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DescarteService {
  constructor(
    @InjectModel('Descarte') private readonly descarteModel: Model<any>,
  ) {}

  async create(data) {
    const novo = new this.descarteModel({
      ...data,
      data: data.data ? new Date(data.data) : new Date(),
    });
    return await novo.save();
  }

  async readAll() {
    const list = await this.descarteModel.find().exec();
    return list.map(d => ({
      id: d._id,
      nomeLocal: d.nomeLocal,
      bairro: d.bairro,
      tipoLocal: d.tipoLocal,
      categoriasResiduos: d.categoriasResiduos,
      nomeUsuario: d.nomeUsuario,
      tipoResiduo: d.tipoResiduo,
      data: d.data,
    }));
  }

  async readByTipo(tipoResiduo: string) {
    return await this.descarteModel.find({ tipoResiduo }).exec();
  }

  async deleteById(id: string) {
    const result = await this.descarteModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Registro não encontrado');
    }
    return { mensagem: 'Registro removido' };
  }

  
  async relatorioGeral() {
  const agora = new Date();

  const trintaDiasAtras = new Date(agora);
  trintaDiasAtras.setDate(agora.getDate() - 29);
  trintaDiasAtras.setHours(0, 0, 0, 0);

  const topLocal = await this.descarteModel.aggregate([
    { $group: { _id: '$nomeLocal', total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 1 },
  ]);
  const localComMaisRegistros = topLocal.length > 0 ? topLocal[0]._id : 'Nenhum';
  
  const topTipo = await this.descarteModel.aggregate([
    { $group: { _id: '$tipoResiduo', total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 1 },
  ]);
  const tipoMaisComum = topTipo.length > 0 ? topTipo[0]._id : 'Nenhum';

  const ultimos30 = await this.descarteModel.countDocuments({
    data: { $gte: trintaDiasAtras, $lte: agora },
  });
  const mediaPorDia30 = +(ultimos30 / 30).toFixed(2);

  const usuarios = await this.descarteModel.distinct('nomeUsuario');
  const totalUsuarios = usuarios.length;

  const pontos = await this.descarteModel.distinct('nomeLocal');
  const totalPontos = pontos.length;

  const inicioMesAtual = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const inicioMesAnterior = new Date(agora.getFullYear(), agora.getMonth() - 1, 1);
  const fimMesAnterior = new Date(agora.getFullYear(), agora.getMonth(), 0, 23, 59, 59, 999);

  const mesAtual = await this.descarteModel.countDocuments({
    data: { $gte: inicioMesAtual, $lte: agora },
  });
  const mesAnterior = await this.descarteModel.countDocuments({
    data: { $gte: inicioMesAnterior, $lte: fimMesAnterior },
  });

  let variacaoPercentual = 0;
  if (mesAnterior === 0 && mesAtual > 0) variacaoPercentual = 100;
  else if (mesAnterior > 0)
    variacaoPercentual = +(((mesAtual - mesAnterior) / mesAnterior) * 100).toFixed(2);

  return {
    localComMaisRegistros,
    tipoMaisComum,
    mediaPorDia30,
    totalUsuarios,
    totalPontos,
    variacaoPercentual,
  };
}
}
