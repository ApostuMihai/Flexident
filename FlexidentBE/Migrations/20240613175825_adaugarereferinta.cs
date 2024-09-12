using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Flexident.Migrations
{
    /// <inheritdoc />
    public partial class adaugarereferinta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LucrareEfectuataLucrareEfectuataId",
                table: "Comentarii",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Comentarii_LucrareEfectuataLucrareEfectuataId",
                table: "Comentarii",
                column: "LucrareEfectuataLucrareEfectuataId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comentarii_LucrariEfectuate_LucrareEfectuataLucrareEfectuat~",
                table: "Comentarii",
                column: "LucrareEfectuataLucrareEfectuataId",
                principalTable: "LucrariEfectuate",
                principalColumn: "LucrareEfectuataId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comentarii_LucrariEfectuate_LucrareEfectuataLucrareEfectuat~",
                table: "Comentarii");

            migrationBuilder.DropIndex(
                name: "IX_Comentarii_LucrareEfectuataLucrareEfectuataId",
                table: "Comentarii");

            migrationBuilder.DropColumn(
                name: "LucrareEfectuataLucrareEfectuataId",
                table: "Comentarii");
        }
    }
}
