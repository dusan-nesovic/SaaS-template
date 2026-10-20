using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SaasTemplate.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUserPreferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Language",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Theme",
                table: "Users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "Users",
                type: "character varying(5)",
                maxLength: 5,
                nullable: false,
                defaultValue: "en");

            migrationBuilder.AddColumn<int>(
                name: "Theme",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 3);
        }
    }
}
