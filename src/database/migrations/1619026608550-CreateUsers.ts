import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateUsers1619026608550 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
                {
                    name: 'users',
                    columns: [
                        {
                            name: 'id',
                            type: 'uuid',
                            isPrimary: true
                        },
                        {
                            name: 'email',
                            type: 'varchar'
                        },
                        {
                            name: 'created_at',
                            type: 'timestamp'
                        }
                    ]
                }
            )
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}
