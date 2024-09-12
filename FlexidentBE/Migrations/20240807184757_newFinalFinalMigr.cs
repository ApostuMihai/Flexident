using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Flexident.Migrations
{
    /// <inheritdoc />
    public partial class newFinalFinalMigr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LucrariEfectuate_Comentarii_ComentariuId",
                table: "LucrariEfectuate");

            migrationBuilder.DropIndex(
                name: "IX_LucrariEfectuate_ComentariuId",
                table: "LucrariEfectuate");

            migrationBuilder.DropColumn(
                name: "LucrareEfectuataId",
                table: "Comentarii");

            migrationBuilder.RenameColumn(
                name: "ComentariuId",
                table: "LucrariEfectuate",
                newName: "ComentariuComentariuId");

            migrationBuilder.CreateIndex(
                name: "IX_LucrariEfectuate_ComentariuComentariuId",
                table: "LucrariEfectuate",
                column: "ComentariuComentariuId");

            migrationBuilder.AddForeignKey(
                name: "FK_LucrariEfectuate_Comentarii_ComentariuComentariuId",
                table: "LucrariEfectuate",
                column: "ComentariuComentariuId",
                principalTable: "Comentarii",
                principalColumn: "ComentariuId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LucrariEfectuate_Comentarii_ComentariuComentariuId",
                table: "LucrariEfectuate");

            migrationBuilder.DropIndex(
                name: "IX_LucrariEfectuate_ComentariuComentariuId",
                table: "LucrariEfectuate");

            migrationBuilder.RenameColumn(
                name: "ComentariuComentariuId",
                table: "LucrariEfectuate",
                newName: "ComentariuId");

            migrationBuilder.AddColumn<int>(
                name: "LucrareEfectuataId",
                table: "Comentarii",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_LucrariEfectuate_ComentariuId",
                table: "LucrariEfectuate",
                column: "ComentariuId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_LucrariEfectuate_Comentarii_ComentariuId",
                table: "LucrariEfectuate",
                column: "ComentariuId",
                principalTable: "Comentarii",
                principalColumn: "ComentariuId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
