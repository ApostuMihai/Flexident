using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Flexident.Migrations
{
    /// <inheritdoc />
    public partial class typomigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DescirereLucrare",
                table: "Lucrari",
                newName: "DescriereLucrare");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DescriereLucrare",
                table: "Lucrari",
                newName: "DescirereLucrare");
        }
    }
}
