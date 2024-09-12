using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Flexident.Migrations
{
    /// <inheritdoc />
    public partial class programareModificataMigr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LucrareLucrareId",
                table: "Programari",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "ProgramareEfectuata",
                table: "Programari",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Programari_LucrareLucrareId",
                table: "Programari",
                column: "LucrareLucrareId");

            migrationBuilder.AddForeignKey(
                name: "FK_Programari_Lucrari_LucrareLucrareId",
                table: "Programari",
                column: "LucrareLucrareId",
                principalTable: "Lucrari",
                principalColumn: "LucrareId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Programari_Lucrari_LucrareLucrareId",
                table: "Programari");

            migrationBuilder.DropIndex(
                name: "IX_Programari_LucrareLucrareId",
                table: "Programari");

            migrationBuilder.DropColumn(
                name: "LucrareLucrareId",
                table: "Programari");

            migrationBuilder.DropColumn(
                name: "ProgramareEfectuata",
                table: "Programari");
        }
    }
}
