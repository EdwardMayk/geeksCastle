import { Controller, Post, Body, Put, Param } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../entities/customer.entitiy';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'The customer has been successfully created.',
    schema: {
      example: {
        id: 'abc123',
        name: 'John',
        lastname: 'Doe',
        birthday: '1990-01-01',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createCustomer(@Body() customer: CreateCustomerDto): Promise<Customer> {
    return this.customerService.createCustomer(customer);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({
    name: 'id',
    description: 'Customer ID',
    type: String,
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'The customer was updated.',
    schema: {
      example: {
        id: 'abc123',
        name: 'John',
        lastname: 'Doe',
        birthday: '1990-01-01',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  async updateCustomer(
    @Param('id') id: string,
    @Body() customer: CreateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.updateCustomer(id, customer);
  }
}
