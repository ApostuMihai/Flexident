using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Flexident.Migrations
{
    /// <inheritdoc />
    public partial class contActivMigr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "lastLogin",
                table: "Users",
                newName: "LastLogin");

            migrationBuilder.RenameColumn(
                name: "contActiv",
                table: "Users",
                newName: "ContActiv");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastLogin",
                table: "Users",
                newName: "lastLogin");

            migrationBuilder.RenameColumn(
                name: "ContActiv",
                table: "Users",
                newName: "contActiv");
        }
    }
}
