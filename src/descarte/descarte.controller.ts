import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DescarteService } from './descarte.service';

@Controller('descarte')
export class DescarteController {
  constructor(private readonly service: DescarteService) {}

  @Post()
  async create(@Body() body) {
    return await this.service.create(body);
  }

  @Get()
  async readAll() {
    return await this.service.readAll();
  }

  @Get('tipo/:tipoResiduo')
  async readByTipo(@Param('tipoResiduo') tipoResiduo: string) {
    return await this.service.readByTipo(tipoResiduo);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.deleteById(id);
  }

  @Get('relatorio/geral')
  async relatorio() {
    return await this.service.relatorioGeral();
  }
}
